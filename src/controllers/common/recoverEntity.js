const recoverEntity = async (Model, req, res) => {
  const { id } = req.params;
  try {
    const restoredEntity = await Model.restore({ where: { id } });
    if (restoredEntity) {
      return res.status(200).send('Entity restored successfully');
    } else {
      return res.status(404).send('Entity not found or already active');
    }
  } catch (error) {
    return res.status(500).send('Error restoring entity: ' + error.message);
  }
};
