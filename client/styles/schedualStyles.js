import { StyleSheet } from "react-native";
import { StatusBar } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6EF",
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#fcdc8f',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  weekDayName: {
    fontWeight: 'bold'
  }
});