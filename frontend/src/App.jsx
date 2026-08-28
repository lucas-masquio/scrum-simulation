import Painel from "./components/Painel";
import { ControladorPainel } from "./controllers/ControladorPainel";

export default function Aplicacao() {
  return <Painel controlador={ControladorPainel()} />;
}