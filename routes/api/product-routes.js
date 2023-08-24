const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productById = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productById) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res.status(200).json(productById);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    console.log(req.body.tagIds);

    if (req.body.tagIds) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      console.log(productTagIdArr);

      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      console.log(productTagIds);

      res.status(200).json({ message: "Product Created!", product: product });
    } else {
      res.status(200).json({ message: "Product Created!", product: req.body });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

// update product
router.put("/:id", async (req, res) => {
  // update product data
  try {
    const updateProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await ProductTag.destroy({ where: { id: productTagsToRemove } });
      await ProductTag.bulkCreate(newProductTags);
      res.json({ message: "Product updated", changes: req.body });
    } else {
      res.json({ message: "Product updated", changes: req.body });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productData) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    res
      .status(200)
      .json({ message: "Product deleted!", deletedID: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "this is stupid", error: err });
  }
});

module.exports = router;
