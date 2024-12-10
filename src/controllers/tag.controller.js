import Tag from '../models/Tag.js';

// Create Tag
export async function createTag(req, res) {
  const { name } = req.body;

  try {
    let tag = await Tag.findOne({ name });
    if (tag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    tag = await Tag.create({ name });

    res.status(201).json(tag);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get All Tags
export async function getTags(req, res) {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get Single Tag
export async function getTag(req, res) {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json(tag);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Update Tag
export async function updateTag(req, res) {
  const { name } = req.body;

  try {
    let tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    tag.name = name || tag.name;

    await tag.save();
    res.json(tag);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Delete Tag
export async function deleteTag(req, res) {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    await tag.remove();
    res.json({ message: 'Tag removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.status(500).send('Server Error');
  }
}
