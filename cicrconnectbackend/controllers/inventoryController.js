const Inventory = require('../models/Inventory');

// Get all components
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find().populate('issuedTo.user', 'name collegeId');
    res.json(items);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};

// Add new component (Admin only)
exports.addComponent = async (req, res) => {
  try {
    const { totalQuantity } = req.body;
    const newItem = new Inventory({
      ...req.body,
      availableQuantity: totalQuantity 
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
  }
};

// Issue component to a member
exports.issueComponent = async (req, res) => {
  const { itemId, quantity, project } = req.body;
  try {
    const item = await Inventory.findById(itemId);
    if (!item || item.availableQuantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    item.availableQuantity -= quantity;
    item.issuedTo.push({ user: req.user.id, quantity, project });
    await item.save();
    res.json({ message: 'Item issued successfully', item });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
};