//Here you will import route files and export them as used in previous labs
import postRoutes from './posts.js'
import eventRoutes from './events.js'
import userRoutes from './auth_routes.js';

const constructorMethod = (app) => {
  app.use('/posts', postRoutes);
  app.use('/user', userRoutes);
  app.use('/events', eventRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: '404 Error: Page not found'});
  });
};

export default constructorMethod;
