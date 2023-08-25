const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  // find all products including the assoicated category and tags

  try {
    const products = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });

    //200 ok, return the products
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  // find a single product by its `id` including the assoicated category and tags
  try {
    const productById = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    //if no product witht hat id, return the error messaage and 404 code
    if (!productById) {
      res.status(404).json({ message: "No product found with that id!" });
      return;
    }

    //if exists, return the product and a 200 ok code
    res.status(200).json(productById);
  } catch (error) {
    res.status(500).json(error);
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    //create a new product and save it to the product
    const product = await Product.create(req.body);

    //if the new prodcut has tagids, map and return just the ids
    if (req.body.tagIds) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      //create product tags using the returned tagids
      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);

      //200 ok status, returning the message and the created product
      res.status(200).json({ message: "Product Created!", product: product });
    } else {
      res.status(200).json({ message: "Product Created!", product: product });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

// update product
router.put("/:id", async (req, res) => {
  // update product data
  try {
    //update using the req body to the given id
    const updateProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    //if there are tagids
    if (req.body.tagIds && req.body.tagIds.length) {
      //get all the existing tag ids for that product
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      //map only those tags
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

      // figure out which tagids to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      //destroy the product tags that we dont need
      await ProductTag.destroy({ where: { id: productTagsToRemove } });

      //create the product tags we do need
      await ProductTag.bulkCreate(newProductTags);

      //200 ok, return message and the changes
      res.status(200).json({ message: "Product updated", changes: req.body });
    } else {
      res.status(200).json({ message: "Product updated", changes: req.body });
    }
  } catch (error) {
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

    //checks if there is a product with that id
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
