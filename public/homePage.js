'use strict';

const logoutButton = new LogoutButton();
const ratesBoard = new RatesBoard();
const moneyManager = new MoneyManager();
const favoritesWidget = new FavoritesWidget();

logoutButton.action = () => {
  ApiConnector.logout(signal => {
    if (signal.success) {
      location.reload();
    }
  });
}

ApiConnector.current(user => {
  if (user.success) {
    ProfileWidget.showProfile(user.data);
  }
});

ApiConnector.getStocks(getStocks);

function getStocks(stocks) {
  let getData = () => {
    ratesBoard.clearTable();
    ratesBoard.fillTable(stocks.data);
  }
  if (stocks.success) {
    getData();
    setInterval(() => {
      getData();
    }, 60000);
  }
}

moneyManager.addMoneyCallback = ({ currency, amount }) => {
  ApiConnector.addMoney( { currency, amount }, func => {
    if (func.success) {
      ProfileWidget.showProfile(func.data);
      moneyManager.setMessage(func.success, 'Баланс пополнен');
    } else {
      moneyManager.setMessage(func.success, func.error);
    }
  });
}

moneyManager.conversionMoneyCallback = ({ fromCurrency, targetCurrency, fromAmount }) => {
  ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, func => {
    if (func.success) {
      ProfileWidget.showProfile(func.data);
      moneyManager.setMessage(func.success, 'Конвертирование валюты выполнено');
    }  else {
      moneyManager.setMessage(func.success, func.error);
    }
  });
}

moneyManager.sendMoneyCallback = ({ to, amount, currency }) => {
  ApiConnector.transferMoney({ to, amount, currency }, data => {
    if (data.success) {
      ProfileWidget.showProfile(data.data);
      moneyManager.setMessage(data.success, 'Перевод выполнен');
    } else {
      moneyManager.setMessage(data.success, data.error);
    }
  });
}

ApiConnector.getFavorites(data => {
  if (data.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(data.data);
    moneyManager.updateUsersList(data.data);
  }
});



favoritesWidget.addUserCallback = ({ id, name }) => {
  ApiConnector.addUserToFavorites({ id, name }, data => {
      if (data.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(data.data);
        moneyManager.updateUsersList(data.data);
        favoritesWidget.setMessage(data.success, 'Пользователь добавлен в адресную книгу');
      } else {
        favoritesWidget.setMessage(data.success, data.error);
      }
  });
}

favoritesWidget.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, data => {
    if (data.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(data.data);
      moneyManager.updateUsersList(data.data);
      favoritesWidget.setMessage(data.success, 'Пользователь успешно удален из адресной книги');
    } else {
      favoritesWidget.setMessage(data.success, data.error);
    }
  });
}
