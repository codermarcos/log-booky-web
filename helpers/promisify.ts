const callback = (resolve: any, reject: any) => (error: any, result: any) => {

  if (error) reject(error);
  else resolve(result);


};

export default callback;
