const validateProductData = (isUpdate = false) => {
    return (req, res, next) => {
      const { name, price, stock_quantity, description, category } = req.body;
      const errors = [];
      
      if (name != undefined) {
        if (name.trim().length < 1) {
          errors.push('Nazwa produktu nie może być pusta');
        } else if (name.length > 255) {
          errors.push('Nazwa produktu nie może być dłuższa niż 255 znaków');
        }
      } else if (!isUpdate) {
        errors.push('Nazwa produktu nie może być pusta');
      }
      
      if (category != undefined) {
        if (category.trim().length < 1) {
          errors.push('Kategoria nie może być pusta');
        }
      } else if (!isUpdate) {
        errors.push('Kategoria nie może być pusta');
      }
      
      if (description != undefined) {
        if (description.length < 10) {
          errors.push('Opis produktu musi być dłuższy niż 10 znaków');
        } else if (description.length > 10000) {
          errors.push('Opis produktu nie może przekroczyć 10000 znaków');
        }
      } else if (!isUpdate) {
        errors.push('Opis produktu musi być dłuższy niż 10 znaków');
      }
      
      if (price != undefined) {
        if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
          errors.push('Cena produktu nie może być liczbą ujemną');
        }
      } else if (!isUpdate) {
        errors.push('Cena produktu jest wymagana');
      }
      
      if (stock_quantity != undefined && stock_quantity != null) {
        if (isNaN(parseInt(stock_quantity)) || parseInt(stock_quantity) < 0) {
          errors.push('Ilość produktów w magazynie nie może być ujemna');
        }
      }
      
      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Błędy walidacji',
          errors: errors
        });
      }
      
      next();
    };
  };
  
  module.exports = {
    validateProductData
  };
  