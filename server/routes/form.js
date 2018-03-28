const nodemailer = require("nodemailer");

function generateMessage(data) {
    return "<div>" +
        "<p><strong>Nome</strong>: " + data.formNome + "</p>" +
        "<p><strong>Email</strong>: " + data.formEmail + "</p>" +
        "<p><strong>Tipo de Contato</strong>: " + data.formTipo + "</p>" +
        "<p><strong>Mensagem</strong>:<br>" + data.formMensagem.replace(/\n/g, "<br>") + "</p>" +
        "</div>";
}

let form = {

    postDadosContato: (req, res) => {
        if (!req.body) return res.sendStatus(400);
        let data = req.body;

        let mensagem = generateMessage(data);

        let smtpTransport = nodemailer.createTransport({
            host: 'smtp.umbler.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        let mailOptions = {
            from: "Lucas <hi@lucasbalbino.com>",
            to: "Lucas <hi@lucasbalbino.com>",
            subject: "[🎥 Estreias] Novo Contato - "+ data.formNome + " - " + data.formEmail,
            html: mensagem
        };

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log("Erro: ", error);
                smtpTransport.close();
                res.status(500).send("Erro ao enviar contato. Tente novamente!");
            } else {
                smtpTransport.close();
                res.send("Email enviado com sucesso!");
            }
        });
    }
};

module.exports = form;