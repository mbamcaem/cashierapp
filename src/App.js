import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Hasil, NavbarComponent, ListCategori, Menus } from "./components/index";
import { API_URL } from "./utils/constants";
import axios from "axios";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: [],
      categoridipilih: 'Makanan'
    };
  }

  
  componentDidMount() {
    axios
    .get(API_URL+"products?category.nama="+this.state.categoridipilih)
    .then((res) => {
      const menus = res.data;
      this.setState({ menus });
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  changeCategory = (value) => {
    this.setState({
      categoridipilih: value,
      menus : []
    })

    axios
    .get(API_URL+"products?category.nama="+value)
    .then((res) => {
      const menus = res.data;
      this.setState({ menus });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  

  render() {
    const { menus , categoridipilih } = this.state;
    return (
      <div className="App">
        <NavbarComponent />
        <div className="mt-3">
          <Container fluid>
            <Row>
              <ListCategori changeCategory={this.changeCategory} categoridipilih={categoridipilih}/>
              <Col>
                <h4>
                  <strong>Daftar Produk</strong>
                </h4>
                <hr />
                <Row>
                  {menus && menus.map((menu) =>(
                    <Menus 
                    key={menu.id}
                    menu={menu}
                    />
                  ))}
                </Row>
              </Col>
              <Hasil />
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

// export default App;
