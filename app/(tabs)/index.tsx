import { Image, Text, TextInput, Button, StyleSheet, View, TouchableOpacity } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import React, { useState } from "react";
import Checkbox from 'expo-checkbox';
import ParallaxScrollView from '@/components/ParallaxScrollView';

interface IToDo {
  text: string;
  completed: boolean;
}



export default function HomeScreen() {
  const [value, setValue] = useState<string>("");
  const [toDoList, setToDos] = useState<IToDo[]>([]);
  const [error, showError] = useState<Boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (value.trim()) {
      setToDos([...toDoList, { text: value, completed: false }]);
      setValue("");
    } else {
      showError(true);
    }
  };

  const removeItem = (index: number): void => {
    const newToDoList = [...toDoList];
    newToDoList.splice(index, 1);
    setToDos(newToDoList);
  };

  const toggleComplete = (index: number): void => {
    const newToDoList = [...toDoList];
    newToDoList[index].completed = !newToDoList[index].completed;
    setToDos(newToDoList);
  };

  const toggleSelectAll = (): void => {
    const updatedList = toDoList.map(task => ({
      ...task,
      completed: !selectAll,
    }));
    setToDos(updatedList);
    setSelectAll(!selectAll);
  };

  const incompleteTasks = toDoList.filter(task => !task.completed);
  const completedTask = toDoList.filter(task => task.completed);

  return (
    <View style={styles.pageBackground}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#FFD1DC', dark: '#FFC1CC' }}
        headerImage={
          <Image
            source={require('@/assets/images/homeicon.png')}
            style={styles.homeIcon}
          />
        }>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Let's Be Productive Today!</ThemedText>
          <HelloWave />
        </ThemedView>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="What do you want to do?"
            value={value}
            onChangeText={e => {
              setValue(e);
              showError(false);
            }}
            style={styles.inputBox}
          />

          <TouchableOpacity
            style={styles.smallButton}
            onPress={handleSubmit}
          >
          <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.allButton}
            onPress={toggleSelectAll}
          >
            <Text style={styles.buttonText}>
              {selectAll ? "Deselect All" : "Select All"}
            </Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text style={styles.error}>Error: Input field is empty...</Text>
        )}

        <Text style={styles.subtitle}>Your Tasks :</Text>

        {incompleteTasks.length === 0 && <Text>Relax. You have nothing to do yet. </Text>}

        {incompleteTasks.map((toDo: IToDo, index: number) => (
          <View style={styles.listItem} key={`${index}_${toDo.text}`}>
            <Checkbox
              style={styles.checkbox}
              value={toDo.completed}
              onValueChange={() => toggleComplete(toDoList.indexOf(toDo))}
            />
            <Text
              style={[
                styles.task,
                { textDecorationLine: toDo.completed ? "line-through" : "none" }
              ]}
            >
              {toDo.text}
            </Text>
            <Button
              title="Delete"
              onPress={() => removeItem(index)}
              color="#da4e4e"
            />
          </View>
        ))}

        {completedTask.length > 0 && (
          <>
            <Text style={styles.accomplishedSubtitle}>Accomplished Task :</Text>
            {completedTask.map((toDo: IToDo, index: number) => (
              <View style={styles.listItem} key={`${index}_${toDo.text}`}>
                <Checkbox
                  style={styles.checkbox}
                  value={toDo.completed}
                  onValueChange={() => toggleComplete(toDoList.indexOf(toDo))}
                />
                <Text
                  style={[
                    styles.task,
                    styles.completedTask
                  ]}
                >
                  {toDo.text}
                </Text>
                <Button
                  title="Delete"
                  onPress={() => removeItem(toDoList.indexOf(toDo))}
                  color="#da4e4e"
                />
              </View>
            ))}
          </>
        )}
      </ParallaxScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  pageBackground: {
    flex: 1,
    backgroundColor: "pink",
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  homeIcon: {
    height: 200,
    width: 200,
    bottom: 0,
    top: 70,
    left: 0,
    position: 'absolute',
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  inputBox: {
    width: 200,
    borderColor: "#800020",
    borderRadius: 8,
    borderWidth: 2,
    paddingLeft: 8
  },
  title: {
    fontSize: 40,
    marginBottom: 40,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "purple",
    fontWeight: "bold"
  },
  accomplishedSubtitle: {
    top:15,
    fontSize: 20,
    marginBottom: 20,
    color: "green",
    fontWeight: "bold"
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10
  },
  checkbox: {
    margin: 8,
  },
  task: {
    width: 200,
    marginLeft: 10,
  },
  completedTask: {
    color: "gray",
    textDecorationLine: "line-through",
  },
  error: {
    color: "red"
  },
  smallButton: {
    width: 100, // Adjust the width to make it smaller
    height: 40,
    backgroundColor: '#800020',
    paddingVertical: 6, // Adjust padding as necessary
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allButton: {
    width: 100, // Adjust the width to make it smaller
    height: 40,
    backgroundColor: 'purple',
    paddingVertical: 6, // Adjust padding as necessary
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14, // Adjust font size
  },
});