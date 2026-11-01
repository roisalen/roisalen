afterAll(async () => {
  await require('../db').close();
});
