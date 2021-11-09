import Message from "../../assets/img/message.svg";

const Alert = ({text}) => {
  return (
    <div className="alert-success-container">
      <div className="alert-success">
        <img src={Message} alt="Message" className="w-24 h-24 mb-4"></img>
        <div className="text-xl font-objetive-bold">
          {text} de <br />
          manera exitosa!
        </div>
      </div>
    </div>
  );
};

export default Alert;
