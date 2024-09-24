import { withState, compose, lifecycle, withHandlers } from 'recompose'
import { includes } from 'lodash'

const withSearch = ({ collectionProp, params }) => {
  const searched = `${collectionProp}Searched`

  return compose(
    withState(
      searched,
      'setSearched',
      ({ [collectionProp]: collection }) => collection
    ),
    lifecycle({
      componentWillReceiveProps(nextProps) {
        if (nextProps[collectionProp] !== this.props[collectionProp]) {
          this.setState({
            [collectionProp]: nextProps[collectionProp],
          })

          this.props.setSearched(nextProps[collectionProp])
        }
      },
    }),
    withHandlers({
      query: ({
        [searched]: cs,
        [collectionProp]: collection,
        setSearched,
      }) => ({ target: { value } }) => {
        const terms = value
          .split(' ')
          .map(term => term.toLowerCase())
          .filter(term => term !== '')

        const searchedCollection =
          terms.length > 0
            ? collection.filter(entity =>
                terms.some(term =>
                  params.some(param =>
                    includes(`${entity[param]}`.toLowerCase(), term)
                  )
                )
              )
            : collection

        setSearched(searchedCollection)
      },
    })
  )
}

export default withSearch
