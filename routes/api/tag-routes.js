const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags and include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [{ model: Product }],
    });

    //200 ok code, return all the tags
    res.status(200).json(tags);
  } catch (error) {
    //500 internal server error, return the error
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id` and include its associated Product data
  try {
    const tagById = await Tag.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    //checks if there is a tag with that id
    if (!tagById) {
      //404 tag not found error
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    //200 ok, return the specific tag
    res.status(200).json(tagById);
  } catch (error) {
    //500 internal server error
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  // create a new tag using the req body
  try {
    const newTag = await Tag.create(req.body);

    //200 ok, return the created tag
    res.status(200).json({ message: "New tag created", newTag: newTag });
  } catch (error) {
    //400 error, return the error
    res.status(400).json(error);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    //update using the req body, of the id
    const updatedTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    //200 ok, return message and the changes
    res.status(200).json({ message: "Tag updated", changes: req.body });
  } catch (error) {
    //400 error, return the error
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    //checks if there is a tag with that id
    if (!tagData) {
      res.status(404).json({ message: "No tag found with that id!" });
      return;
    }

    //200 ok, return message and the deleted id
    res.status(200).json({ message: "Tag deleted", deletedID: req.params.id });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
