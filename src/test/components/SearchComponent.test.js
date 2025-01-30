import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import SearchComponent from "../../components/SearchBarComponent.vue";

describe("SearchComponent", () => {
  // Datos de prueba para el componente
  const items = [
    { id: 1, name: "Instrumento 1" },
    { id: 2, name: "Instrumento 2" },
    { id: 3, name: "Instrumento 3" },
  ];

  const itemLabel = (item) => item.name;

  it("renderiza correctamente los datos del estado", async () => {
    // Montar el componente
    const wrapper = mount(SearchComponent, {
      props: {
        items,
        itemLabel,
        itemKey: "name",
      },
    });

    // Simular la entrada en el campo de búsqueda
    await wrapper.find("input").setValue("Instrumento 1");

    // Esperar que el DOM se actualice
    await wrapper.vm.$nextTick();

    const listItems = wrapper.findAll("li");
    expect(listItems.length).toBe(1);
    expect(listItems[0].text()).toBe("Instrumento 1");
  });

  it("debe manejar correctamente la selección de un item", async () => {
    const wrapper = mount(SearchComponent, {
      props: {
        items,
        itemLabel,
        itemKey: "name",
      },
    });

    // Simular entrada en el input para que aparezcan los elementos filtrados
    await wrapper.find("input").setValue("Instrumento");

    // Esperar a que el DOM se actualice después de la entrada
    await wrapper.vm.$nextTick();

    // Verificar que los elementos filtrados estén presentes
    const listItem = wrapper.find("li");
    expect(listItem.exists()).toBe(true); // Verifica que el item exista antes de interactuar con él

    // Simular clic en el primer item
    await listItem.trigger("click");

    // Verificar que el evento fue emitido
    const emitted = wrapper.emitted("item-selected");
    expect(emitted).toHaveLength(1); // Verifica que el evento solo haya sido emitido una vez
    expect(emitted[0][0]).toEqual(items[0]); // Verifica que los datos sean correctos
  });
});
