/// <reference types="cypress" />
import contrato from "../contratos/usuarios.contrato.js"

describe("Testes da Funcionalidade Usuários", () => {
  let token;

  beforeEach(() => {
    cy.token("fulano@qa.com", "teste").then((tkn) => {
      token = tkn;
    });
  });

  it("Deve validar contrato de usuários", () => {
    cy.request("usuarios").then((response) => {
      return contrato.validateAsync(response.body)
    })
  });

  it("Deve listar usuários cadastrados", () => {
    cy.request({
      method: "GET",
      url: "usuarios",
    }).should((response) => {
      expect(response.status).equal(200);
      expect(response.body).to.have.property("usuarios");
    });
  });

  it("Deve cadastrar um usuário com sucesso", () => {
    let usuario = "Aluno da EBAC " + Math.floor(Math.random() * 10000000000);
    let email = "alunodaebac" + Math.floor(Math.random() * 10000000000) + "@teste.com";

    cy.cadastrarUsuario(token, usuario, email, "testEBAC", "true").should(
      (response) => {
        expect(response.status).equal(201);
        expect(response.body.message).equal("Cadastro realizado com sucesso");
      }
    );
  });

  it("Deve validar um usuário com email inválido", () => {
    cy.cadastrarUsuario(token, "Fulano da Silva", "fulano@qa.com", "teste", "true")
      .should((response) => {
        expect(response.status).equal(400);
        expect(response.body.message).equal("Este email já está sendo usado");
      });
  });

  it("Deve editar um usuário previamente cadastrado", () => {
    let usuario = "Aluno da EBAC" + Math.floor(Math.random() * 10000000000)
    let email = "alunodaebac" + Math.floor(Math.random() * 10000000000) + "@teste.com";

    cy.cadastrarUsuario(token, usuario, email, "testEBAC", "true").then(
      (response) => {
        let id = response.body._id
        cy.request({
          method: "PUT",
          url: `usuarios/${id}`,
          headers: { authorization: token },
          body: {
            nome: usuario + " editado",
            email: "EDICAO" + email,
            password: "EBAC",
            administrador: "false",
          },
        }).should((response) => {
          expect(response.body.message).to.equal(
            "Registro alterado com sucesso",
          )
          expect(response.status).to.equal(200)
        })
      },
    )
  });

  it("Deve deletar um usuário previamente cadastrado", () => {
    let email = "alunodaebac" + Math.floor(Math.random() * 10000000000) + "@teste.com";

    cy.cadastrarUsuario(token, "Aluno da EBAC a ser deletado", email, "testEBAC", "true")
      .then((response) => {
        let id = response.body._id
        cy.request({
          method: "DELETE",
          url: `usuarios/${id}`,
          headers: { authorization: token },
        }).should((resp) => {
          expect(resp.body.message).to.equal("Registro excluído com sucesso")
          expect(resp.status).to.equal(200)
        })
      })
  });
});
