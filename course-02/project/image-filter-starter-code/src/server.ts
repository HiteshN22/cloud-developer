import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {
  // Init the Express application
  const app = express();
  // Set the network port
  const port = process.env.PORT || 8082;
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  var urlExists = require('url-exists');

  // Root Endpoint

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;
  
  // Error ==> No url
  console.log(image_url)
  if (!image_url) {
    res.status(400).send("Something wrong with the URL : try GET /filteredimage?image_url={{}} ")
  }

  else {

  //URL ==> Validation
    urlExists(image_url, function(err: any, out: any) {
      if(!out){
      res.status(400).send("Invalid URL")
    }
    });

    //Image Url ==> Validation

    try {
      let image_response = await filterImageFromURL( image_url )
      if (image_response==="error"){
        res.status(415).send('It must be Image URL');
    }else{

    //If All Good ==> :)
      res.status(200).sendFile(image_response, async () =>{
      await deleteLocalFiles([image_response])
      })
    }
  }catch{
    res.status(415).send('No Image URL : kindly provide link to any image');
  }
}
  
});

app.get( "/", async (req: Request, res: Response) => {
  res.send("try GET /filteredimage?image_url={{}}")
} );
  


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();