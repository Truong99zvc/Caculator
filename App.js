import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Switch,
  ScrollView 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function App() {
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [justCalculated, setJustCalculated] = useState(false);

  const theme = isDarkTheme ? darkTheme : lightTheme;

  const handleNumber = (value) => {
    if (['+', '-', '*', '/'].includes(value)) {
      setJustCalculated(false);
      setResult(result + value);
    } else {
      if (justCalculated) {
        setResult(value);
        setJustCalculated(false);
      } else {
        setResult(result + value);
      }
    }
  };

  const calculate = () => {
    if (!result) return;
    try {
      const output = eval(result).toString();
      setHistory([...history, { expression: result, result: output }]);
      setResult(output);
      setJustCalculated(true);
    } catch (e) {
      setResult('Error');
    }
  };

  const clean = () => setResult('');
  const undo = () => setResult(result.slice(0, -1));

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <View style={styles.themeSwitch}>
          <Switch
            value={!isDarkTheme}
            onValueChange={() => setIsDarkTheme(!isDarkTheme)}
          />
          <Icon name="sun" size={20} color={theme.textColor} />
        </View>
        <Icon name="calculator" size={20} color={theme.textColor} />
        <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
          <Icon name="history" size={20} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal style={styles.resultContainer}>
        <Text style={[styles.result, { color: theme.textColor }]}>{result}</Text>
      </ScrollView>

      {showHistory && (
        <ScrollView style={styles.historyContainer}>
          {history.map((item, index) => (
            <Text key={index} style={styles.historyItem}>
              {item.expression} = {item.result}
            </Text>
          ))}
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <View style={styles.numbers}>
          {['7','8','9','4','5','6','1','2','3','0','.'].map(num => (
            <TouchableOpacity 
              key={num}
              style={[styles.button, { backgroundColor: theme.bg }]}
              onPress={() => handleNumber(num)}
            >
              <Text style={[styles.buttonText, { color: theme.textColor }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.operations}>
          {[
            {label: 'DEL', onPress: undo},
            {label: 'AC', onPress: clean},
            {label: 'x', value: '*'},
            {label: '/', value: '/'},
            {label: '+', value: '+'},
            {label: '-', value: '-'},
            {label: '=', onPress: calculate},
          ].map((op, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.operationButton, { backgroundColor: theme.bg }]}
              onPress={op.onPress || (() => handleNumber(op.value))}
            >
              <Text style={[styles.buttonText, { color: '#1a73e0' }]}>{op.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  themeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultContainer: {
    height: 50,
    marginVertical: 10,
  },
  result: {
    fontSize: 30,
    textAlign: 'right',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  numbers: {
    flex: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  operations: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  button: {
    width: '28%',
    height: 60,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  operationButton: {
    width: '80%',
    height: 60,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  historyContainer: {
    position: 'absolute',
    top: 60,
    right: 10,
    backgroundColor: '#35434a',
    padding: 10,
    zIndex: 999,
    maxHeight: 200,
  },
  historyItem: {
    color: '#fff',
    marginBottom: 5,
  },
});

const darkTheme = {
  bg: '#0f212a',
  textColor: '#e9eef4',
};

const lightTheme = {
  bg: '#e9eef4',
  textColor: '#0e0e0e',
};