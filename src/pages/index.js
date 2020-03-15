import { graphql, Link } from "gatsby"

import React from "react"

import { useLocalJsonForm } from "gatsby-tinacms-json"
import {
  useLocalRemarkForm,
  RemarkCreatorPlugin,
  DeleteAction,
} from "gatsby-tinacms-remark"
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

function HomePage({ data, location, isEditing, setIsEditing }) {
  console.log("⚡🚨: HomePage -> data", data)
  // const parsed = qs.parse(window.location.search);
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/hooks.md#uselocation
  // console.log("⚡🚨: parsed", parsed);
  const handleBuild = () => {
    console.log("TODO")
  }
  // const AllDecksForm = {
  //   label: "Decks",
  //   fields: [
  //     {
  //       label: "Title",
  //       name: "frontmatter.title",
  //       description: "Enter the title of the deck here",
  //       component: "text",
  //     },
  //     {
  //       label: "Slides",
  //       name: "rawMarkdownBody",
  //       description: "Enter the slides content here",
  //       component: "textarea",
  //     },
  //   ],
  // }

  // const [allMarkdownRemark] = useLocalRemarkForm(data.allMarkdownRemark)
  // const [allMarkdownRemark] = useLocalRemarkForm(
  //   data.allMarkdownRemark,
  //   AllDecksForm
  // )

  const allDecks = data.allMarkdownRemark.nodes
  console.log("⚡🚨: HomePage -> allDecks", allDecks)

  return (
    <IndexStyles>
      <ul>
        {allDecks.map(deck => {
          const {
            fileRelativePath,
            frontmatter: { title },
          } = deck
          const deckPath = fileRelativePath.split("/")[4]
          console.log("⚡🚨: HomePage -> deckPath", deckPath)
          return (
            <>
              <Link to={`/${deckPath}`}>
                <DeckListItem key={title} title={title} />
              </Link>
              <Divider />
            </>
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

    return `content/blog/${slug}/index.md`
  },
  frontmatter: form => ({
    title: form.title,
    date: new Date(),
  }),
  actions: [DeleteAction],
  fields: [
    { name: "title", label: "Title", component: "text", required: true },
  ],
  body: form => `${form.title}
  ---
  This is a new slide.
  ---
  this is another slide!`,
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
