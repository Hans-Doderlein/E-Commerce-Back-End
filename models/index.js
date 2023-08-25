// import models
const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Products belongToMany Tags (through ProductTag), on delete of product, deletes from ProductTag
Product.belongsToMany(Tag, { through: ProductTag, onDelete: "CASCADE" });

// Tags belongToMany Products (through ProductTag), deletes from ProductTag
Tag.belongsToMany(Product, { through: ProductTag, onDelete: "CASCADE" });

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
