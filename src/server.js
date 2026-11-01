const { app } = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Campus Records Hub running on port ${PORT}`);
});
