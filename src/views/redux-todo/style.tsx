import {css} from "@emotion/react";

export const vanillaStyle = css`
  padding: 15px;
  
  h2 {
    display: inline-flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
  }
`

export const todoItemDoneStyle = css`
  text-decoration: line-through;
  background-color: #eee;
  opacity: 0.6;
`

export const todoItemStyle = css`
  padding: 10px 10px 10px 0;
  list-style: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  align-items: start;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .content {
    
  }
  
  h3 {
    margin: 5px 0;
  }
`
