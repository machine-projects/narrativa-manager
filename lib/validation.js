class Validation {
    constructor(body) {
        this.body = body;
        this.missingFields = [];
    }

    /**
     * Verifica vários campos obrigatórios em uma única chamada.
     * @param {Object} fields - Objeto com campos e suas condições de validação.
     */
    requireFields(fields) {
        Object.entries(fields).forEach(([fieldName, condition]) => {
            const isValid = typeof condition === 'function' ? condition(this.body[fieldName]) : Boolean(this.body[fieldName]);
            if (!isValid) {
                this.missingFields.push(fieldName);
            }
        });
    }

    /**
     * Retorna os campos obrigatórios ausentes.
     * @returns {Array} - Lista de campos ausentes.
     */
    getMissingFields() {
        return this.missingFields;
    }

    /**
     * Verifica se há campos ausentes e lança um erro, se necessário.
     * @param {Response} res - Objeto de resposta do Express.
     * @returns {boolean} - Retorna `true` se há campos ausentes, caso contrário, `false`.
     */
    validate(res) {
        if (this.missingFields.length > 0) {
            res.status(400).json({
                error: 'Os seguintes campos são obrigatórios:',
                missingFields: this.missingFields,
            });
            return true;
        }
        return false;
    }
}

module.exports = Validation;
