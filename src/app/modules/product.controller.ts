import { Request, Response } from "express";
import { productServices } from "./product.service";
import productValidateSchema from "./product.validation";

// for create product
const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const zodParseData = productValidateSchema.parse(productData);
    const result = await productServices.createProductIntoDB(zodParseData);

    res.status(200).json({
      success: true,
      message: "Product is created successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

// search a single product by it's id
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const result = await productServices.getSingleProductFromDB(productId);

    res.status(200).json({
      success: true,
      message: "Product  is retrieved successfully",
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

// delete any product by id
const deleteSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const deletedProduct = await productServices.deleteProductFromDB(productId);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// update any product information
const updateSingleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updatedProduct = req.body; // Assuming product data is in request body

    const result = await productServices.updateProductFromDB(
      productId,
      updatedProduct
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// get all products and search Term data
const searchProducts = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm as string; // Search term from query string

    const products = await productServices.getProducts(searchTerm); // Call getProducts with optional searchTerm

    res.status(200).json({
      success: true,
      message: products.length > 0 ? "Products found" : "No products found",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const productControllers = {
  createProduct,
  getSingleProduct,
  updateSingleProduct,
  deleteSingleProduct,
  searchProducts,
};
