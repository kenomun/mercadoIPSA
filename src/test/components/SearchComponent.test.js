import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import SearchComponent from "../../components/SearchBarComponent.vue";

describe("SearchComponent", () => {
  const items = [
    { id: 1, name: "Instrumento 1" },
    { id: 2, name: "Instrumento 2" },
    { id: 3, name: "Instrumento 3" },
  ];

  const itemLabel = (item) => item.name;

  it("renderiza correctamente los datos del estado", async () => {
    const wrapper = mount(SearchComponent, {
      props: {
        items,
        itemLabel,
        itemKey: "name",
      },
    });

    await wrapper.find("input").setValue("Instrumento 1");
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

    await wrapper.find("input").setValue("Instrumento");
    await wrapper.vm.$nextTick();

    // Verificar que los elementos filtrados estén presentes
    const listItem = wrapper.find("li");
    expect(listItem.exists()).toBe(true);
    // Simular clic en el primer item
    await listItem.trigger("click");

    const emitted = wrapper.emitted("item-selected");
    expect(emitted).toHaveLength(1);
    expect(emitted[0][0]).toEqual(items[0]);
  });
});
