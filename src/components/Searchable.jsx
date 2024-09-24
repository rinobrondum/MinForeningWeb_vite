import {Component} from 'react'

class Searchable extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      items: nextProps.items.filter((item) =>
        nextProps.predicate(item, prevState.value)
      ),
      value: prevState.value,
    }
  }

  state = {
    items: [],
    value: null,
  }

  handleChange = ({target: {value}}) => this.setState({value})

  render() {
    const {children} = this.props
    const {items} = this.state

    return children({items, handleChange: this.handleChange})
  }
}

export default Searchable
