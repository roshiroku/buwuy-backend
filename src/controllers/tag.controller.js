import Tag from '../models/Tag.js';

// Create Tag
export async function createTag(req, res) {
  try {
    const { name } = req.body;
    const tag = await Tag.create({ name });
    res.status(201).json(tag);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Tags
export async function getTags(req, res) {
  try {
    const { skip, limit, ...params } = req.query;
    const tags = await Tag.find(params).skip(skip).limit(limit);
    res.json(tags);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
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
    res.status(500).send({ message: 'Server Error' });
  }
}

// Update Tag
export async function updateTag(req, res) {
  try {
    const { name } = req.body;
    let tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    tag.name = name ?? tag.name;

    await tag.save();
    res.json(tag);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Delete Tag
export async function deleteTag(req, res) {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json({ message: 'Tag removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
