
import { GraphQLClient, gql } from 'graphql-request';

const hygraph = new GraphQLClient(
  'https://api-sa-east-1.hygraph.com/v2/clwktl9rv018707w2rnojn4lk/master'
);



export async function getFaqs() {

  const QUERY = gql`
    query Faqs  {
        faqs (first: 30){
          answer
          ask
          category
          id
        }
      }
    `;

  const { faqs } = await hygraph.request(QUERY)

  return {
    props: {
      faqs
    }
  }
}

export async function sendFaq(params) {

  const MUTATION = gql`
        mutation {
          createFaq(data:{
            ask: "${params.ask}"
            answer: "${params.answer}"
            category: "${params.category}"
          }
          ) {
            id
          }
        }
    `

  const result = await hygraph.request(MUTATION)
  // .then((res) => {
  //   publishFaq(res.createFaq.id)
  // })
  
  return result

}

export async function publishFaq (id) {
  const PUBLISH = gql`
  mutation {
    publishFaq(where : {id : "${id}"}) {
        id
      }
    }
  `

  const result = await hygraph.request(PUBLISH)

  return result
}

export async function deleteFaq (id) {
  const DEL = gql`
  mutation deleteFaq{ 
    deleteFaq(where: {id: "${id}"}) {
    id
    }
  }
  `

  const result = await hygraph.request(DEL)

  return result
}

export async function updateFaq (id, params) {
  //console.log(id, params)
  
  const UP = gql`
  mutation updateFaq{ 
    updateFaq(where: {id: "${id}"}, 
    data: {
      ask: "${params.ask}"
      answer: "${params.answer}"
      category: "${params.category}"
    }) {
    id
    }
  }
  `

  const result = await hygraph.request(UP)

  return result
}


