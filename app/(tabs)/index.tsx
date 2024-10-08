import { Image, Text, TextInput, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from "react";
import Checkbox from 'expo-checkbox';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Icon from 'react-native-vector-icons/FontAwesome';

interface IToDo {
  index: number;
  text: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [value, setValue] = useState<string>("");
  const [newListName, setNewListName] = useState<string>('');
  const [selectedList, setSelectedList] = useState<string>('Personal'); // Default list
  const [toDoLists, setToDoLists] = useState<{ [key: string]: IToDo[] }>({
    Personal: [],
    School: [],
    Shopping: [],
  });
  const [error, showError] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (value.trim()) {
      const currentTasks = toDoLists[selectedList];
      const newTask = {
        index: currentTasks.length ? currentTasks[currentTasks.length - 1].index + 1 : 1,
        text: value,
        completed: false
      };
      setToDoLists({
        ...toDoLists,
        [selectedList]: [...currentTasks, newTask],
      });
      setValue("");
    } else {
      showError(true);
    }
  };

  const removeItem = (index: number): void => {
    const updatedList = toDoLists[selectedList].filter(task => task.index !== index);
    setToDoLists({ ...toDoLists, [selectedList]: updatedList });
  };

  const toggleComplete = (index: number): void => {
    const updatedList = toDoLists[selectedList].map(task =>
      task.index === index ? { ...task, completed: !task.completed } : task
    );
    setToDoLists({ ...toDoLists, [selectedList]: updatedList });
  };

  const toggleSelectAll = (): void => {
    const updatedList = toDoLists[selectedList].map(task => ({
      ...task,
      completed: !selectAll,
    }));
    setToDoLists({ ...toDoLists, [selectedList]: updatedList });
    setSelectAll(!selectAll);
  };

  const handleCreateNewList = (): void => {
    if (newListName.trim() && !toDoLists[newListName]) {
      setToDoLists({
        ...toDoLists,
        [newListName]: [],
      });
      setNewListName('');
    }
  };

  const handleCreateNewListOnSubmit = (): void => {
    handleCreateNewList();
  };

  const handleDeleteList = (listName: string) => {
    if (listName !== selectedList) {
      const { [listName]: deletedList, ...remainingLists } = toDoLists;
      setToDoLists(remainingLists);
      if (selectedList === listName) {
        const newSelectedList = Object.keys(remainingLists)[0] || 'Personal';
        setSelectedList(newSelectedList);
      }
    }
  };

  const incompleteTasks = toDoLists[selectedList].filter(task => !task.completed);
  const completedTasks = toDoLists[selectedList].filter(task => task.completed);

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

        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.navBar}>
          {Object.keys(toDoLists).map((type) => (
            <View style={styles.navBarItem} key={type}>
              <TouchableOpacity
                style={[
                  styles.navBarButton,
                  selectedList === type && styles.activeNavBarButton,
                ]}
                onPress={() => setSelectedList(type)}
              >
                <Text style={styles.navBarText}>{type}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeleteList(type)}
              >
                <Icon name="trash" size={20} color="#da4e4e" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Add New List */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Add a new list."
            value={newListName}
            onChangeText={text => setNewListName(text)}
            onSubmitEditing={handleCreateNewListOnSubmit} // Handle Enter key press
            style={styles.inputBox}
          />
        </View>

        {/* Input to Add Task */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder={`What do you want to do?`}
            value={value}
            onChangeText={e => {
              setValue(e);
              showError(false);
            }}
            onSubmitEditing={handleSubmit}
            style={styles.inputBox}
          />
        </View>

        {error && (
          <Text style={styles.error}>Error: Input field is empty...</Text>
        )}

        <Text style={styles.subtitle}>Your Tasks:</Text>

        <TouchableOpacity
          style={styles.allButton}
          onPress={toggleSelectAll}
        >
          <Text style={styles.buttonText}>
            {selectAll ? "Deselect All" : "Select All"}
          </Text>
        </TouchableOpacity>

        {incompleteTasks.length === 0 && <Text>Relax. You have nothing to do yet.</Text>}

        {incompleteTasks.map((toDo: IToDo) => (
          <View style={styles.listItem} key={toDo.index}>
            <Checkbox
              style={styles.checkbox}
              value={toDo.completed}
              onValueChange={() => toggleComplete(toDo.index)}
            />
            <Text
              style={[
                styles.task,
                { textDecorationLine: toDo.completed ? "line-through" : "none" }
              ]}
            >
              {toDo.text}
            </Text>
            <TouchableOpacity
              style={styles.deleteTaskButton}
              onPress={() => removeItem(toDo.index)}
            >
              <Icon name="trash" size={20} color="#da4e4e" />
            </TouchableOpacity>
          </View>
        ))}

        {completedTasks.length > 0 && (
          <>
            <Text style={styles.accomplishedSubtitle}>Accomplished Tasks :</Text>
            {completedTasks.map((toDo: IToDo) => (
              <View style={styles.listItem} key={toDo.index}>
                <Checkbox
                  style={styles.checkbox}
                  value={toDo.completed}
                  onValueChange={() => toggleComplete(toDo.index)}
                />
                <Text
                  style={[
                    styles.task,
                    styles.completedTask
                  ]}
                >
                  {toDo.text}
                </Text>
                <TouchableOpacity
                  style={styles.deleteTaskButton}
                  onPress={() => removeItem(toDo.index)}
                >
                  <Icon name="trash" size={20} color="#da4e4e" />
                </TouchableOpacity>
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
    marginBottom: 20,
    height: 40
  },
  inputBox: {
    width: "100%",
    borderColor: "#800020",
    borderRadius: 8,
    borderWidth: 2,
    paddingLeft: 8
  },
  navBar: {
    flexDirection: 'row',
    marginVertical: 10,
    height: 50, 
  },
  navBarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  navBarButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#9f95cc',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeNavBarButton: {
    backgroundColor: '#800020',
  },
  navBarText: {
    color: '#fff',
  },
  deleteIcon: {
    marginLeft: 10,
  },
  deleteTaskButton: {
    marginLeft: 'auto',
    marginRight: 10
  },
  title: {
    fontSize: 40,
    marginBottom: 40,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  subtitle: {
    fontSize: 20,
    color: "maroon",
    fontWeight: "bold"
  },
  accomplishedSubtitle: {
    top: 15,
    fontSize: 20,
    marginBottom: 20,
    color: "green",
    fontWeight: "bold"
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: '#e6e6fa',
    borderColor: "#800020",
    borderRadius: 8,
    borderWidth: 2,
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
  allButton: {
    width: "100%", 
    height: 35,
    backgroundColor: '#9f95cc',
    paddingVertical: 6, 
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "maroon",
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 14, 
  }
});
