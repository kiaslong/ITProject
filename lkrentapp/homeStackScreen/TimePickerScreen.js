import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import 'moment/locale/vi'; // Import Vietnamese locale for Moment.js
import { useDispatch, useSelector } from 'react-redux';
import { setTime } from '../store/timeSlice';

const { width } = Dimensions.get("window");

// Custom function to format date with day abbreviation
const formatDateWithDay = (date) => {
  const dayMap = {
    0: "CN",
    1: "T2",
    2: "T3",
    3: "T4",
    4: "T5",
    5: "T6",
    6: "T7",
  };
  const day = dayMap[moment(date).day()];
  return `${moment(date).format('HH:mm')} ${day}, ${moment(date).format('DD/MM')}`;
};

const TimePicker = ({ navigation = {} }) => {
  const dispatch = useDispatch();
  const time = useSelector(state => state.time.time);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const slideAnim = useState(new Animated.Value(300))[0];

  useEffect(() => {
    moment.locale('vi'); // Set locale to Vietnamese
    if (time) {
      const [start, end] = time.split(" - ");
      setStartDate(moment(start, "HH:mm, DD/MM"));
      setEndDate(moment(end, "HH:mm, DD/MM"));
    }
  }, [time]);

  const handleConfirmButton = () => {
    if (startDate && endDate) {
      const formattedTime = `${formatDateWithDay(startDate)} - ${formatDateWithDay(endDate)}`;
      setTimeout(() => {
        dispatch(setTime(formattedTime));
        navigation.goBack();
      }, 500);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const showTimePicker = (picker, date) => {
    setCurrentPicker(picker);
    setSelectedDate(date);
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const calculateNumberOfDays = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return "?";
    }

    const diffInDays = moment(endDate).diff(moment(startDate), "days");
    return diffInDays >= 0 ? diffInDays : "?";
  };

  const roundToNext30Minutes = (time) => {
    const minutes = time.minute();
    if (minutes % 30 === 0) {
      return time;
    }
    const remainder = 30 - (minutes % 30);
    return time.add(remainder, 'minutes').startOf('minute');
  };

  const handleConfirm = (time) => {
    const roundedTime = roundToNext30Minutes(moment(time));
    const dateTime = moment(selectedDate)
      .hour(roundedTime.hour())
      .minute(roundedTime.minute());

    if (currentPicker === "start") {
      if (endDate && dateTime.isSame(endDate, "minute")) {
        alert("Start time cannot be the same as end time");
      } else {
        setStartDate(dateTime);
        if (endDate && dateTime.isAfter(endDate)) {
          setEndDate(null);
        }
      }
    } else if (currentPicker === "end") {
      if (startDate && dateTime.isSame(startDate, "minute")) {
        alert("End time cannot be the same as start time");
      } else if (startDate && dateTime.isBefore(startDate)) {
        alert("End time cannot be before start time");
      } else {
        setEndDate(dateTime);
      }
    }
    hideTimePicker();
  };

  const getDaysArray = (year, month) => {
    const daysInMonth = moment(`${year}-${month + 1}`, "YYYY-MM").daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const getMonthData = () => {
    moment.locale('vi'); // Set locale to Vietnamese
    const startMonth = moment();
    const endMonth = moment().add(2, "months");
    const months = [];

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    for (
      let month = startMonth.clone();
      month.isBefore(endMonth, "month") || month.isSame(endMonth, "month");
      month.add(1, "month")
    ) {
      months.push({
        monthName: capitalizeFirstLetter(month.format("MMMM")),
        monthIndex: month.month(),
        year: month.year(),
        firstDay: month.startOf("month").day(),
        days: getDaysArray(month.year(), month.month()),
      });
    }

    return months;
  };

  const monthData = getMonthData();
  const currentDate = moment();

  const handleDatePress = (date, monthIndex) => {
    if (!monthData[monthIndex]) {
      console.error("Invalid month index:", monthIndex);
      return;
    }

    const selectedMoment = moment()
      .year(monthData[monthIndex].year)
      .month(monthData[monthIndex].monthIndex)
      .date(date);

    if (selectedMoment.isBefore(currentDate, 'day')) {
      return; // Do nothing for dates before the current date
    }

    if (!startDate || (startDate && endDate)) {
      showTimePicker("start", selectedMoment);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (moment(startDate).isSame(selectedMoment, "day")) {
        showTimePicker("start", selectedMoment);
      } else {
        showTimePicker("end", selectedMoment);
      }
    }
  };

  const isDateSelected = (date, monthIndex, type) => {
    if (!monthData[monthIndex]) {
      return false;
    }

    if (type === "start") {
      return (
        startDate &&
        moment(startDate).date() === date &&
        moment(startDate).month() === monthData[monthIndex].monthIndex
      );
    } else if (type === "end") {
      return (
        endDate &&
        moment(endDate).date() === date &&
        moment(endDate).month() === monthData[monthIndex].monthIndex
      );
    }
    return false;
  };

  const isDateBeforeCurrentDate = (date, monthIndex) => {
    const selectedMoment = moment()
      .year(monthData[monthIndex].year)
      .month(monthData[monthIndex].monthIndex)
      .date(date);

    return selectedMoment.isBefore(currentDate, 'day');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {monthData.map((month, monthIndex) => (
          <View key={monthIndex} style={styles.calendar}>
            <Text style={styles.monthTitle}>{`${month.monthName} ${month.year}`}</Text>
            <View style={styles.weekDays}>
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                <Text key={day} style={styles.weekDay}>
                  {day}
                </Text>
              ))}
            </View>
            <View style={styles.dates}>
              {Array.from({ length: month.firstDay }).map((_, index) => (
                <View
                  key={`empty-${index}`}
                  style={[styles.date, { borderColor: "transparent" }]}
                />
              ))}
              {month.days.map((date, index) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.date,
                    isDateBeforeCurrentDate(date, monthIndex) ? styles.disabledDate : null,
                    isDateSelected(date, monthIndex, "start")
                      ? styles.startDate
                      : null,
                    isDateSelected(date, monthIndex, "end")
                      ? styles.endDate
                      : null,
                  ]}
                  onPress={() => !isDateBeforeCurrentDate(date, monthIndex) && handleDatePress(date, monthIndex)}
                  disabled={isDateBeforeCurrentDate(date, monthIndex)}
                >
                  <Text style={[
                    styles.dateText,
                    isDateBeforeCurrentDate(date, monthIndex) ? styles.disabledDateText : null,
                  ]}>
                    {date}
                    {isDateSelected(date, monthIndex, "start")
                      ? `\n${moment(startDate).format("HH:mm")}`
                      : isDateSelected(date, monthIndex, "end")
                      ? `\n${moment(startDate).format("HH:mm")}`
                      : null}
                  </Text>
                </TouchableOpacity>
              ))}
              {(() => {
                const totalDaysDisplayed = month.firstDay + month.days.length;
                const remainingDays = 7 - (totalDaysDisplayed % 7);
                if (remainingDays < 7) {
                  return Array.from({ length: remainingDays }).map(
                    (_, index) => (
                      <View
                        key={`filler-${index}`}
                        style={[styles.date, { borderColor: "transparent" }]}
                      />
                    )
                  );
                }
                return null;
              })()}
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={styles.timePicker}>
        <TouchableOpacity
          style={[styles.timeButton, styles.startTimeButton]}
          onPress={() => showTimePicker("start", startDate || moment())}
        >
          <Text style={styles.timeText}>
            Nhận xe:{" "}
            {startDate
              ? formatDateWithDay(startDate)
              : "Chọn thời gian"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.timeButton, styles.endTimeButton]}
          onPress={() => showTimePicker("end", endDate || moment())}
        >
          <Text style={styles.timeText}>
            Trả xe:{" "}
            {endDate
              ? formatDateWithDay(endDate)
              : "Chọn thời gian"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} />
      <View style={styles.confirmContainer}>
        <View style={styles.textConfirmContainer}>
          <Text style={styles.rentalInfo}>
            {startDate &&
              endDate &&
              `${formatDateWithDay(startDate)} - ${formatDateWithDay(endDate)}`}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.numberOfDays}>
              Số ngày thuê: {calculateNumberOfDays(startDate, endDate)}
            </Text>
            <TouchableOpacity style={styles.questionMark} onPress={openModal}>
              <MaterialCommunityIcons
                name="help-circle-outline"
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.nextButton} onPress={handleConfirmButton}>
          <Text style={styles.nextButtonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        minuteInterval={30}
        isVisible={isTimePickerVisible}
        mode="time"
        date={selectedDate ? selectedDate.toDate() : new Date()}
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />
      <Modal
        hardwareAccelerated
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <Animated.View
                style={[
                  styles.modalView,
                  { transform: [{ translateY: slideAnim }] },
                ]}
              >
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Thời gian thuê xe</Text>
                <Text style={styles.modalText}>
                  Giá thuê xe được tính theo ngày. Nếu bạn thuê xe dưới 24h sẽ
                  được tính tròn 1 ngày.{" "}
                </Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "white",
  },
  separator: {
    height: 1.3,
    backgroundColor: "#E0E0E0",
    marginVertical: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 14,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 28,
    padding: 5,
    width: 28,
    height: 28,
    marginBottom: 16,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 16,
    alignSelf: "flex-start",
    textAlign: "left",
    fontWeight: "600",
    marginBottom: 16,
  },
  modalText: {
    marginBottom: 20,
    textAlign: "left",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#03a9f4",
    marginBottom: 16,
  },
  calendar: {
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  weekDays: {
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weekDay: {
    fontSize: 16,
    width: width / 8,
    textAlign: "center",
  },
  dates: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  date: {
    width: width / 8,
    height: width / 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderRadius: width / 10,
    borderWidth: 0.6,
    borderColor: "#ccc",
  },
  startDate: {
    backgroundColor: "#03a9f4",
    borderColor: "#03a9f4",
  },
  endDate: {
    backgroundColor: "#FF4500",
    borderColor: "#FF4500",
  },
  dateText: {
    fontSize: 13,
    textAlign: "center",
    color: "#333",
  },
  disabledDate: {
    backgroundColor: "#e0e0e0",
    borderColor: "#e0e0e0",
  },
  disabledDateText: {
    color: "#a0a0a0",
  },
  timePicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  startTimeButton: {
    backgroundColor: "#e0f7fa",
    borderColor: "#b2ebf2",
  },
  endTimeButton: {
    backgroundColor: "#ffe0b2",
    borderColor: "#ffcc80",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  confirmContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  textConfirmContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  rentalInfo: {
    fontSize: 14,
    marginRight:2,
    alignSelf: "center",
    textAlign: "center",
    fontWeight: "600",
  },
  nextButton: {
    backgroundColor: "#03a9f4",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  numberOfDays: {
    fontSize: 16,
  },
  questionMark: {
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default TimePicker;
