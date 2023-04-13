import { connect } from "react-redux";
import { mapStateToProps } from "../pages";

function Feed({ goToPlayer }) {
  return (
    <h1
      onClick={() => goToPlayer("nik")}
      className="text-3xl font-bold underline"
    >
      Click me Nik
    </h1>
  );
}

export default connect(mapStateToProps, (dispatch) => ({
  goToPlayer: (tx) => dispatch({ type: "PLAYER", payload: { tx } }),
}))(Feed);
