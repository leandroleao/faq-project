
import { GraphQLClient, gql } from 'graphql-request';

const hygraph = new GraphQLClient(
  'https://api-sa-east-1.hygraph.com/v2/clwktl9rv018707w2rnojn4lk/master'
);

// const hygraph = new GraphQLClient(
//   'https://api-sa-east-1.hygraph.com/v2/clwktl9rv018707w2rnojn4lk/master',
//   {
//     headers: {
//       Authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MTY2NTEyMTgsImF1ZCI6WyJodHRwczovL2FwaS1zYS1lYXN0LTEuaHlncmFwaC5jb20vdjIvY2x3a3RsOXJ2MDE4NzA3dzJybm9qbjRsay9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1zYS1lYXN0LTEuaHlncmFwaC5jb20vIiwic3ViIjoiN2M1MjY0NjctNWFlNy00Y2Q3LWJjNzctYmZiNjNjZDE1MDJiIiwianRpIjoiY2x3bTl0OXFnMDlmbTA3a2Y0a3A3OTl3NCJ9.bkYj6yt1nnAq5to5TAkkcIz4jf7R37zlzodipGUD1z8Tpr_eRkk_k4A7ML5h5DK8RyKX9bqKLEHjBJ0ME1BgVeL0aV6pA_3krgf2bIkXINh7zOjY8uao2_UFyKdrCOR_yMPLd8CjvPMfTnSvrmIo_MiC7yrIYho5pNmVKmnt46cLyqUo2mru6sGhPxY9BsN4pM3AWqENOvZYWk-1GEHBwirrsFK-Cb0heiVplAICFcqk0-d1yXJNzs8xtNXdP3Snsa5uGHslwlTl5gM3etf0otbOwVlWEZcu-lQYwH3HDjKFRVPOWNVQViE0wWn_0KP7RclRmE5tQGZoYqpuQI03xA4fQRVu8o6XCjnYz_W7Zhs-HkHutp6cFBStN0-It_3KgUblhwIWhRqt2xhaMbsO0N_UYKL0XjzeftXZPzlnZyB6yCgjjFAmEsY38Ikokaz7wd2F_Lvp7bvxUg9WYi1WSrJL5shkB39eDo6b57AQTA_A_TyuHOqZ7BwX4sQ1XDnNfK5WfhZyYwO5w7SC8zgrdvCytkC7YxRMyRguLk6UY22TFEl09wexLJ7AEoeT-TcNRKJwQWM-2Bg1OhDD1r5LjYF3Sscme5CThaA73cOikigVJntc1Im-LmWdWj_vGvXXJZU9KPwZTlkHpg1_hLeuk3JoZin_sS2H5iGfJgd-9-w'
//     }
//   }
// );

const QUERY = gql `
query Faqs {
    faqs {
      answer
      ask
      category
    }
  }
`;

export async function getFaqs() {
  const { faqs } = await hygraph.request(QUERY)

  return {
    props: {
      faqs
    }
  }
}

// import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

// const client = new ApolloClient({
//   uri: 'https://api-sa-east-1.hygraph.com/v2/clwktl9rv018707w2rnojn4lk/master',
//   cache: new InMemoryCache(),
// });

// export function getFaqs() {
//   client
//     .query({
//       query: gql`
//     query Faqs {
//            faqs {
//              answer
//              ask
//              category
//            }
//          }
//     `,
//     })
//     .then((result) => console.log(result));

// }


