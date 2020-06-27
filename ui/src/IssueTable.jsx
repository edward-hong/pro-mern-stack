import React from 'react'
import { Link } from 'react-router-dom'

const IssueRow = ({ issue }) => (
  <tr>
    <td>{issue.id}</td>
    <td>{issue.status}</td>
    <td>{issue.owner}</td>
    <td>{issue.created.toDateString()}</td>
    <td>{issue.effort}</td>
    <td>{issue.due ? issue.due.toDateString() : ''}</td>
    <td>{issue.title}</td>
    <td>
      <Link to={`/edit/${issue.id}`}>Edit</Link>
    </td>
  </tr>
)

const IssueTable = ({ issues }) => {
  const issueRows = issues.map((issue) => (
    <IssueRow key={issue.id} issue={issue} />
  ))
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Due Date</th>
          <th>Title</th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </table>
  )
}

export default IssueTable
