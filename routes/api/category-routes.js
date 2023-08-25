const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // finds all categories and includes the Products associated with that category

  try {
    //finds the categories
    const categories = await Category.findAll({
      //include associated products
      include: [{ model: Product }],
    });

    //return 200 OK status, and json the categories object
    res.status(200).json(categories);
  } catch (error) {
    //500 internal server error, json the error
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  // finds specific category using its id and include the Products associated with that category
  try {
    //finds category by id
    const categoryById = await Category.findByPk(req.params.id, {
      //includes associated products
      include: [{ model: Product }],
    });

    //if category doesnt exist, return with 404 not found
    if (!categoryById) {
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    //200 ok status code, JSON the category object
    res.status(200).json(categoryById);
  } catch (error) {
    //500 internal server error, json the error
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  try {
    // create a new category
    const newCategory = await Category.create(req.body);

    //200 ok status code, JSON the new category
    res.status(200).json({ newCategory });
  } catch (error) {
    //400 stats code, json the error
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value

  try {
    //update with the req body, usin the id for selection
    const updatedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    //200 ok code, the category updated, and what was changed
    res.status(200).json({
      message: "Category updated",
      cat_id: req.params.id,
      changes: req.body,
    });
  } catch (error) {
    //400 error code, json the error
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value

  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    //if there is no category with that id
    if (!categoryData) {
      //404 not found
      res.status(404).json({ message: "No category found with that id!" });
      return;
    }

    //200 ok, json the message and the id that was deleted
    res
      .status(200)
      .json({ message: "Category deleted", deletedID: req.params.id });
  } catch (err) {
    //500 error code, json the error
    res.status(500).json(err);
  }
});

module.exports = router;
