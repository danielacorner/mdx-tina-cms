import { graphql, navigate } from "gatsby"

import React from "react"

import ControlsSection from "../components/Controls"
import Deck from "../components/Deck"
import { Wysiwyg } from "@tinacms/fields"
import { TinaField } from "@tinacms/form-builder"
import { inlineRemarkForm } from "gatsby-tinacms-remark"

function DeckTemplate({
  data,
  location,
  isEditing,
  setIsEditing,
  pageContext,
}) {
  const { slug, title, rawMarkdownBody, html } = pageContext
  console.log("⚡🚨: DeckTemplate -> pageContext", pageContext)

  console.log("⚡🚨: data", data)
  // const parsed = qs.parse(window.location.search);
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/hooks.md#uselocation
  // console.log("⚡🚨: parsed", parsed);

  // TODO: use this to share links to decks
  // const [value, setValue] = useState(decodeURI(location.search.slice(1))) // slice off the question mark
  // const handleEditorChange = (ev, value) => {
  //   setValue(value)
  //   navigate(`/?${encodeURI(value)}`, { replace: true })
  // }
  // const handlePreview = () => {
  //   navigate(`/deck-preview?${encodeURI(value)}`)
  // }
  const handleBuild = () => {
    console.log("TODO")
  }

  return (
    <>
      <ControlsSection
        handleEdit={() => setIsEditing(p => !p)}
        isEditing={isEditing}
        handleBuild={handleBuild}
      ></ControlsSection>
      {isEditing ? (
        <TinaField name="rawMarkdownBody" Component={Wysiwyg}>
          <section
            className="content"
            dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }}
          ></section>
        </TinaField>
      ) : (
        <Deck location={location} deckData={data.markdownRemark.html} />
      )}
    </>
  )
}
// 1. Define the form config
const DeckPageForm = {
  label: "Deck",
  fields: [
    {
      label: "Title",
      name: "frontmatter.title",
      description: "Enter the title of the deck here",
      component: "text",
    },
    {
      label: "Slides",
      name: "rawMarkdownBody",
      description: "Enter the slides content here",
      component: "textarea",
    },
  ],
}

export default inlineRemarkForm(DeckTemplate, DeckPageForm)

export const pageQuery = graphql`
  query DeckBySlug($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      ...TinaRemark
      html
      rawMarkdownBody
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`

//   query BlogPostBySlug($slug: String!) {
//     site {
//       siteMetadata {
//         title
//         author
//       }
//     }
//     markdownRemark(fields: { slug: { eq: $slug } }) {
//       id
//       excerpt(pruneLength: 160)
//       html
//       ...TinaRemark
//       frontmatter {
//         title
//         date(formatString: "MMMM DD, YYYY")
//         description
//       }
//     }
//   }
// `
