export function jsonFormData(...fields) {
  return (req, res, next) => {
    try {
      fields.forEach((field) => {
        const value = req.body[field];
        if (value && typeof value === 'string') {
          req.body[field] = JSON.parse(value);
        }
      });
      next();
    } catch (err) {
      next(err);
    }
  };
}
