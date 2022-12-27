import { directus } from '../services/directus';

const envEmail: string = process.env.REACT_APP_EMAIL as string;
const envPwd: string = process.env.REACT_APP_PWD as string;
const debug = 0;

export async function getData(queryScheme: any) {
  //url: string, headers: any, method: string): Promise<any> {
  let authenticated = false;
  // Try to authenticate with token if exists
  var auth = await directus.auth
    .refresh()
    .then(() => {
      authenticated = true;
    })
    .catch(async () => {
      // Let's login in case we don't have token or it is invalid / expired
      //while (!authenticated) {
      return await directus.auth
        .login({ email: envEmail, password: envPwd })
        .then(() => {
          authenticated = true;
        })
        .catch((error) => {
          console.log('Error: ', error);
          return error;
        });
      //}
    });
  // interrupt request due to failed auth
  if (auth !== undefined) return { error: auth };

  if (debug > 1) console.log('API/Run query: ', queryScheme);
  let response;
  try {
    response = await directus.graphql.items(queryScheme);
  } catch (error) {
    console.log(error);
  }

  let res = (response as any).data;

  if (debug > 1) console.log('API/Response: ', res);
  return res;
}
