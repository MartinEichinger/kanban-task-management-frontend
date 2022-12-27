import { directus } from '../services/directus';

const envEmail: string = process.env.REACT_APP_EMAIL as string;
const envPwd: string = process.env.REACT_APP_PWD as string;
const debug = 1;

export async function getData(queryScheme: any, type: any) {
  //url: string, headers: any, method: string): Promise<any> {
  let authenticated = false;
  // Try to authenticate with token if exists
  await directus.auth
    .refresh()
    .then(() => {
      authenticated = true;
    })
    .catch(async () => {
      // Let's login in case we don't have token or it is invalid / expired
      while (!authenticated) {
        await directus.auth
          .login({ email: envEmail, password: envPwd })
          .then(() => {
            authenticated = true;
          })
          .catch((error) => {
            console.log(error);
            //return error;
          });
      }
    });

  console.log('run query: ', queryScheme);
  let response;
  try {
    if (type === 'item') {
      response = await directus.graphql.items(queryScheme);
    } else if (type === 'relation') {
      response = await directus.graphql.system(queryScheme);
    }
  } catch (error) {
    console.log(error);
  }

  let res = (response as any).data;

  if (debug) console.log('api: ', res);
  return res;
}
