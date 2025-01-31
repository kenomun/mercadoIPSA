import { mount, shallowMount } from "@vue/test-utils";
import HeaderComponent from "../../components/HeaderComponent.vue";

describe("HeaderComponent", () => {
  it("debe renderizar correctamente los datos pasados como props", () => {
    const wrapper = shallowMount(HeaderComponent, {
      props: {
        name: "Juan",
        country: "Chile",
        lastPrice: 12345.67,
        pctDay: 2.5,
        pointsVar: 10,
      },
    });

    expect(wrapper.text()).toContain("Juan, Chile");
    expect(wrapper.text()).toMatch(/Valor Actual.*12,345.67/);

    expect(wrapper.text()).toContain("Var.% Actual 2.50%");
    expect(wrapper.text()).toContain("Var. Puntos Actual 10.00");
  });

  it("debe aplicar la clase correcta según el valor de pctDay", () => {
    const wrapperPositive = mount(HeaderComponent, {
      props: {
        name: "Juan",
        country: "Chile",
        lastPrice: 12345.67,
        pctDay: 2.5,
        pointsVar: 10,
      },
    });

    const wrapperNegative = mount(HeaderComponent, {
      props: {
        name: "Juan",
        country: "Chile",
        lastPrice: 12345.67,
        pctDay: -2.5,
        pointsVar: 10,
      },
    });

    expect(wrapperPositive.find(".variation").classes()).toContain(
      "text-success"
    );
    expect(wrapperNegative.find(".variation").classes()).toContain(
      "text-danger"
    );
  });

  it("debe formatear correctamente los números", () => {
    const wrapper = mount(HeaderComponent, {
      props: {
        name: "Juan",
        country: "Chile",
        lastPrice: 12345.6789,
        pctDay: 2.534,
        pointsVar: 10.1234,
      },
    });
    console.log(wrapper.text());
    expect(wrapper.text()).toContain("Valor Actual ↑12,345.68");
    expect(wrapper.text()).toContain("Var.% Actual 2.53%");
    expect(wrapper.text()).toContain("Var. Puntos Actual 10.12");
  });
});
