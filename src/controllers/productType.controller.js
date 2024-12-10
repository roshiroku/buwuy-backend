import ProductType from '../models/ProductType.js';

// Create Product Type
export async function createProductType(req, res) {
  const { name, schema } = req.body;

  try {
    let productType = await ProductType.findOne({ name });
    if (productType) {
      return res.status(400).json({ message: 'ProductType already exists' });
    }

    productType = await ProductType.create({ name, schema });

    res.status(201).json(productType);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get All Product Types
export async function getProductTypes(req, res) {
  try {
    const productTypes = await ProductType.find();
    res.json(productTypes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get Single Product Type
export async function getProductType(req, res) {
  try {
    const productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return res.status(404).json({ message: 'ProductType not found' });
    }
    res.json(productType);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'ProductType not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Update Product Type
export async function updateProductType(req, res) {
  const { name, schema } = req.body;

  try {
    let productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return res.status(404).json({ message: 'ProductType not found' });
    }

    productType.name = name || productType.name;
    productType.schema = schema || productType.schema;

    await productType.save();
    res.json(productType);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'ProductType not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Delete Product Type
export async function deleteProductType(req, res) {
  try {
    const productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return res.status(404).json({ message: 'ProductType not found' });
    }

    await productType.remove();
    res.json({ message: 'ProductType removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'ProductType not found' });
    }
    res.status(500).send('Server Error');
  }
}
