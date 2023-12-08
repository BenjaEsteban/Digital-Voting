import { useState, useEffect } from "react"
import Web3 from 'web3'
import { loadContract } from "./Utils/ABI/ABI"
import detectEthereumProvider from '@metamask/detect-provider'

const App = () => {
  const [web3, setWeb3] = useState(null)
  const [contract, setContract] = useState(null)
  const [candidatos, setCandidatos] = useState([])
  const [voto, setVoto] = useState('')

  useEffect(() => {
    const init = async () => {
      const provider = await detectEthereumProvider()
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' })
        const web3 = new Web3(provider)
        setWeb3(web3)
        const contratoVotacion = await loadContract(web3)
        setContract(contratoVotacion)
      }
      else {
        console.error("Por favor, instale MetaMask")
      }
    }

    init()
  }, [])

  const getCandidatos = async () => {
    if (!contract) return

    try {
      const resultado = await contract.methods.obtenerResultados().call()

      const condi = resultado.map(candidato => {
        return {
          nombre: candidato.nombre,
          conteoDeVotos: parseInt(candidato.conteoDeVotos)
        }
      })
      setCandidatos(condi)
    } catch (error) {
      console.error(error.message)
    }
    
  }

  const votar = async (candidatoID) => {
    if (!contract) return

    try {
      const account = await web3.eth.getAccounts()
      await contract.methods.votar(candidatoID).send({ from: account[0] })
    } catch (error) {
      console.error(error.message)
    }
  }

  return(
    <>
      <div>
        <h1>Votación</h1>
        <button onClick={getCandidatos}>Obtener candidatos</button>

        {candidatos.map((candidato, index) => (
          <div key={index}>
            <p>{candidato.nombre}: {candidato.conteoDeVotos} votos</p>
            <button 
              onClick={() => votar(index)}
              >
                Votar
              </button>
          </div>
        ))}
      </div>
    </>
  )


}

export default App