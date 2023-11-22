//Here you will import route files and export them as used in previous labs
import characterRoutes from './characters.js';
import path from 'path';

const constructorMethod = (app) => {
  app.use('/', characterRoutes);
  app.use('/searchmarvelcharacters', characterRoutes);
  app.use('/marvelcharacter', characterRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: '404 Error: Page not found'});
  });
};

export default constructorMethod;
