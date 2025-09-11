export function useMoveUpOrDown() {
  const moveUpOrDown = async (rowId: string, direction: MoveDirection, data: any,entityName:string) => {
    try {
      const newArray = [...data.JsonData];
      const index = newArray.findIndex(item => item.ID === rowId);
      if (index === -1) {
        // 未找到对应ID的元素
        return;
      }
      let movedIDs: MoveResult | undefined;
      if (direction === MoveDirection.Up && index > 0) {
        // 上移操作
        const movedItem = newArray[index];
        const replacedItem = newArray[index - 1];
        // 交换元素
        [newArray[index], newArray[index - 1]] = [newArray[index - 1], newArray[index]];
        movedIDs = [
          [{ Name: "IDB", Value: movedItem.ID }],
          [{ Name: "IDA", Value: replacedItem.ID }]
        ];
      } else if (direction === MoveDirection.Down && index < newArray.length - 1) {
        // 下移操作
        const movedItem = newArray[index];
        const replacedItem = newArray[index + 1];
        // 交换元素
        [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
        movedIDs = [
          [{ Name: "IDB", Value: movedItem.ID }],
          [{ Name: "IDA", Value: replacedItem.ID }]
        ];
      }
      if(isVoid(movedIDs)) return false;
      const params = { CommandName: 'ChangeSequence', EntityName: entityName, Records: movedIDs };
      const res = await moveRecordUpDown(params);
      if (res.IsSuccess) {
        return newArray;
      }
      else {
        return false;
      }

    }
    catch {
      return false;
    }
  }
  return {
    moveUpOrDown
  }
};
