import { graphql, Link } from "gatsby"

import React from "react"

import { useLocalJsonForm } from "gatsby-tinacms-json"
import { RemarkCreatorPlugin, DeleteAction } from "gatsby-tinacms-remark"
import { withPlugin } from "tinacms"
import styled from "styled-components/macro"
import { Divider, Button } from "@material-ui/core"

const DeckListItem = ({ title }) => (
  <Button>
    <li>{title}</li>
  </Button>
)
const IndexStyles = styled.div`
  a {
    text-decoration: none;
    box-shadow: none;
  }
  button {
    width: 100%;
    text-transform: none;
  }
  li {
    list-style: none;
    margin: 0;
    padding: 1em;
  }
`

function HomePage({ data }) {
  const handleBuild = () => {
    console.log("TODO")
  }

  const allDecks = data.allMarkdownRemark.nodes

  return (
    <IndexStyles>
      <ul>
        {allDecks
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map(deck => {
            const {
              fileRelativePath,
              frontmatter: { title },
            } = deck
            const deckPath = fileRelativePath.split("/")[4]
            return (
              <React.Fragment key={title}>
                <Link to={`/decks/${deckPath}`}>
                  <DeckListItem title={title} />
                </Link>
                <Divider />
              </React.Fragment>
            )
          })}
      </ul>
    </IndexStyles>
  )
}

const CreateDeckPlugin = new RemarkCreatorPlugin({
  label: "Create Deck",
  filename: form => {
    const slug = form.title.replace(/\s+/, "-").toLowerCase()
    return `content/decks/markdown/${slug}/index.md`
  },
  frontmatter: form => {
    const slug = form.title.replace(/\s+/, "-").toLowerCase()
    return {
      title: form.title,
      slug,
      date: new Date(),
    }
  },
  actions: [DeleteAction],
  fields: [
    { name: "title", label: "Title", component: "text", required: true },
  ],
  body: form => `${form.title}
  ---
  This is a new slide.
  ***
  this is another slide!
  `,
})

export default withPlugin(HomePage, CreateDeckPlugin)

export const pageQuery = graphql`
  query AllDecksQuery {
    allMarkdownRemark {
      nodes {
        ...TinaRemark
        frontmatter {
          title
        }
        rawMarkdownBody
        html
        fileRelativePath
      }
    }
  }
`
