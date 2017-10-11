import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Accounts } from 'meteor/accounts-base';

import '../../ui/layouts/app-body.js';

//rotas
FlowRouter.route('/',{
  name: 'front-page',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('FrontPageLayout');
  }
});

//rotas
FlowRouter.route('/criar-colecao',{
  name: 'create-collection',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'createCollection'})
  }
});

//rotas
FlowRouter.route('/tainacan/colecoes',{
  name: 'list-collections',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'listCollections'})
  }
});

//rotas
FlowRouter.route('/:slug',{
  name: 'collection-page',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'collectionPage'})
  }
});

//rotas
FlowRouter.route('/:slug/p/:page?',{
  name: 'collection-pagination',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'collectionPage'})
  }
});
/*******************************************************************************/

FlowRouter.route('/:slug/administracao/metadados',{
  name: 'collection-properties-page',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'propertyCollectionPage'})
  }
});

FlowRouter.route('/:slug/criar-item',{
  name: 'collection-create-item',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'formItem'})
  }
});

FlowRouter.route('/:slug/editar-item/:item',{
  name: 'collection-edit-item',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'formItem'})
  }
});

//view item
FlowRouter.route('/:slug/item/:item',{
  name: 'collection-show-item',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'viewItem'})
  }
});

/**************************** ROTAS PARA CATEGORIAS ***************************************************/
FlowRouter.route('/administracao/categorias',{
  name: 'categories-management-page',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'categoriesManagementPage'})
  }
});

FlowRouter.route('/administracao/categorias/:category',{
  name: 'categories-management-page',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'categoriesManagementPage'})
  }
});
/**************************** ROTAS PARA ferramentas ***************************************************/
FlowRouter.route('/administracao/ferramentas',{
  name: 'toolsPage',
  action(){
    GAnalytics.pageview();
    BlazeLayout.render('App_body',{main:'toolsPage'})
  }
});

// Import to override accounts templates
import '../../ui/accounts/accounts-template.js'; 