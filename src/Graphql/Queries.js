import { gql } from "@apollo/client";

export const GET_USER_LIST = gql`
query{
    userList{
      id
      name
      email
      gender
      status
    }
  }
 `