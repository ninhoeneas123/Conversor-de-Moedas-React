import React, {useState} from 'react';
import './conversor-moedas.css';
import{ Jumbotron, Button, Form, Col, Spinner, Alert, Modal, Nav, FormLabel} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faAngleDoubleRight} from '@fortawesome/free-solid-svg-icons';
import ListarMoedas from './listar-moedas.js'
import axios from 'axios';


function ConversorMoedas() {
  const URL = 'http://data.fixer.io/api/latest?access_key=65c03209b8daaa56ee026e2924959942&format=1'

  const [ valor,setValor ] = useState('1');
  const [ moedaDe, setMoedaDe ] = useState('BRL');
  const [ moedaPara, setMoedaPara] = useState('USD');
  const [ exibirSpinner, setExibirSpinner] = useState(false);
  const [ formValidado, setFormValidado] = useState(false);
  const [ exibirModal, setExibirModal] = useState(false);
  const [ resultadoConversao, setResultadoConversao] = useState('');
  const [ exibirMsgErro, setExibirMsgErro] = useState(false);
  const [ exibirDolar, setExibirDolar] = useState('')

  function handleValue(event) {
    setValor(event.target.value.replace(/\D/g,''));
  }

  function handleMoedaDe(event) {
    setMoedaDe(event.target.value);
  }
  function handleMoedaPara(event) {
    setMoedaPara(event.target.value);
  }
  function handleFecharModal(event) {
    setValor('1');
    setMoedaDe('BRL');
    setMoedaPara('USD');
    setFormValidado(false);
    setExibirModal(false)

  }

 function converter(event){
    event.preventDefault();
    setFormValidado(true);
    if(event.currentTarget.checkValidity() === true){
      setExibirSpinner(true)
      axios.get(URL)
        .then( value => {
          console.log(value.data.rates.BRL)
          const cotacao = obterCotacao(value.data);
          
          if (cotacao){
          setResultadoConversao(`${valor} ${moedaDe} = ${cotacao} ${moedaPara}`)
          setExibirModal(true);
          setExibirSpinner(false);
          setExibirMsgErro(false); 
          
        } else {
          exibirErro();
        }
      }).catch( err => exibirErro());
    }
  }
  function obterCotacao(dadosCotacao){
    if(!dadosCotacao || dadosCotacao.success !== true){
      return false;
    }
    const cotacaoDe = dadosCotacao.rates[moedaDe];
    const cotacaoPara = dadosCotacao.rates[moedaPara];
    const cotacao = (1/cotacaoDe * cotacaoPara)* valor;
    return cotacao.toFixed(2);
  }
  function exibirErro(){
    setExibirMsgErro(true);
    setExibirSpinner(false);
  }


  return (
 <div class="all">

<Nav className="justify-content-center nav" activeKey="/home">
    <Nav.Item>
      <Nav.Link className="link"> HOME </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link className=" link"> CONVERSOR </Nav.Link>
    </Nav.Item>
  </Nav>


      <h1 className='h1'>Conversor de Moedas</h1>
      <Alert variant='danger' show={ exibirMsgErro }>
        Erro ao efetuar a conversão
      </Alert>
      <div class='form'> 
        <Form onSubmit={converter} noValidate validated={formValidado}>
          <Form.Row>
            <Col sm='3'>
              <Form.Label className='label'> VALOR:</Form.Label>
              <Form.Control id='input' placeholder= "0" value={ valor } onChange={ handleValue } required/>
            </Col>
            <Col sm='3'>
              <Form.Group>
                <FormLabel className='label'> MOEDA 1: </FormLabel>
                <Form.Control id="input" as="select" value={ moedaDe } onChange={ handleMoedaDe }>
                  <ListarMoedas/>
                </Form.Control>
              </Form.Group>  
            </Col>
            <Col sm='1' className='text-center' style={{paddingTop:'5px'}}>
              <FontAwesomeIcon className='icon' icon={ faAngleDoubleRight }/>
            </Col>
            <Col sm='3'>
              <FormLabel className='label'> MOEDA 2: </FormLabel>
              <Form.Control id='input' as="select" value={ moedaPara } onChange={ handleMoedaPara } required>
                <ListarMoedas/>
              </Form.Control>
            </Col>
            <Col sm='2'>
              <Button id="bt" type='submit'style={{ marginLeft:'15px' }}>
                <span className={ exibirSpinner ? null : 'hidden' }>
                   <Spinner animation='border' size='sm'/>
                </span>
               <span  className={ exibirSpinner ? 'hidden' : null } >
                  Converter
               </span>
              </Button>
            </Col>
          </Form.Row>
        </Form>
        <Modal show={ exibirModal } onHide={ handleFecharModal } className='Modal'>
          <Modal.Header  className='modalHeader' closeButton>
            <Modal.Title>Conversão</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             { resultadoConversao }
          </Modal.Body>
          <Modal.Footer className='modalFooter'>
            <Button id='bt' onClick={ handleFecharModal }>Nova conversão</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  )}

export default ConversorMoedas;
