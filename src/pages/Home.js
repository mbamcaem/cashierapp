import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  Hasil,
  
  ListCategori,
  Menus,
} from "../components";
import { API_URL } from "../utils/constants";
import axios from "axios";
import swal from "sweetalert";


export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: [],
      categoriDipilih: "Makanan",
      keranjangs: [],
    };
  }

  componentDidMount() {
    this.GetProductByCategory(this.state.categoriDipilih);
    this.GetKantongKeranjang();
  }

  componentDidUpdate(prevState){
    if (this.state.keranjangs !== prevState.keranjangs){
        this.GetKantongKeranjang();
    }
  }

  GetKantongKeranjang = () => {
    axios
      .get(API_URL + "keranjangs")
      .then((res) => {
        const keranjangs = res.data;
        this.setState({ keranjangs });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  GetProductByCategory = (value) => {
    axios
      .get(API_URL + "products?category.nama=" + value)
      .then((res) => {
        const menus = res.data;
        this.setState({ menus });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  changeCategory = (value) => {
    this.setState({
      categoriDipilih: value,
      menus: [],
    });
    this.GetProductByCategory(value);   
  };



  masukKeranjang = (value) => {
    axios
      .get(API_URL + "keranjangs?product.id=" + value.id)
      .then((res) => {
        if (res.data.length === 0) {
          const kantongBelanja = {
            jumlah: 1,
            total_harga: value.harga,
            product: value,
          };

          axios
            .post(API_URL + "keranjangs", kantongBelanja)
            .then((res) => {
              swal({
                title:
                  kantongBelanja.product.nama +
                  " berhasil dimasukan ke dalam kerajang",
                text: "Silahkan memillih makanan, minuman atau cemilan",
                icon: "success",
                buttons: false,
                timer: 1500,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          const kantongBelanja = {
            jumlah: res.data[0].jumlah + 1,
            total_harga: res.data[0].total_harga + value.harga,
            product: value,
          };

          axios
            .put(API_URL + "keranjangs/" + res.data[0].id, kantongBelanja)
            .then((res) => {
              swal({
                title:
                  kantongBelanja.product.nama +
                  " berhasil dimasukan ke dalam kerajang",
                text: "Silahkan memillih makanan, minuman atau cemilan",
                icon: "success",
                buttons: false,
                timer: 1500,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { menus, categoriDipilih, keranjangs } = this.state;
    return (
      <div className="App">
        
        <div className="mt-3">
          <Container fluid>
            <Row>
              <ListCategori
                changeCategory={this.changeCategory}
                categoriDipilih={categoriDipilih}
              />
              <Col>
                <h4>
                  <strong>Daftar Produk</strong>
                </h4>
                <hr />
                <Row>
                  {menus &&
                    menus.map((menu) => (
                      <Menus
                        key={menu.id}
                        menu={menu}
                        masukKeranjang={this.masukKeranjang}
                      />
                    ))}
                </Row>
              </Col>
              <Hasil keranjangs={keranjangs} />
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

