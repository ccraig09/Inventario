return (
    <View style={{flex:1, backgroundColor: '#f3f3f3'}}>
      {/* Rest of the app comes ABOVE the action button component !*/}
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
          <Icon name="md-create" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {}}>
          <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
          <Icon name="md-done-all" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
);
  
<TouchableOpacity
                        style={{
                          ...styles.openButton,
                          backgroundColor: "#A251F9",
                          marginBottom: 7,
                        }}
                        onPress={() => {
                          setPicker(true);
                        }}
                      >
                        <Text style={styles.textStyle}>Categoria</Text>
                        {/* this is for manual add */}
                      </TouchableOpacity>
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={picker}
                        // onRequestClose={() => {
                        //   Alert.alert("Modal has been closed.");
                        // }}
                      >
                        <View style={styles.centeredView}>
                          <View style={styles.modalView}>
                            <Picker
                              selectedValue={picked}
                              mode="dropdown"
                              style={{
                                height: 30,
                                marginTop: 20,
                                marginBottom: 30,
                                width: "100%",
                                justifyContent: "center",
                              }}
                              itemStyle={{ fontSize: 16 }}
                              onValueChange={(itemValue) =>
                                setPicked(itemValue)
                              }
                            >
                              {catOptions.map((item, index) => {
                                return (
                                  <Picker.Item
                                    label={item}
                                    value={item}
                                    key={index}
                                  />
                                );
                              })}
                            </Picker>
                            <TouchableOpacity
                              style={{
                                ...styles.openButton,
                                backgroundColor: "pink",
                                marginTop: 45,
                              }}
                              onPress={() => {
                                setNewCategory(picked);
                                setPicker(false);
                              }}
                            >
                              <Text style={styles.textStyle}>Guardar</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal>












<SearchableDropdown
onTextChange={(text) => console.log(text)}
onItemSelect={(item) => alert(JSON.stringify(item))}
containerStyle={{ padding: 5 }}
textInputStyle={{
  padding: 12,
  borderWidth: 1,
  borderColor: "#ccc",
  backgroundColor: "#FAF7F6",
}}
itemStyle={{
  padding: 10,
  marginTop: 2,
  backgroundColor: "#FAF9F8",
  borderColor: "#bbb",
  borderWidth: 1,
}}
itemTextStyle={{
  color: "#222",
}}
itemsContainerStyle={{
  maxHeight: "60%",
}}
items={items}
defaultIndex={1}
placeholder="Elige un producto"
resetValue={false}
underlineColorAndroid="transparent"
/>