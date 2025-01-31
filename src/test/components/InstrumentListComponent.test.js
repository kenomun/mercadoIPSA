import { mount } from "@vue/test-utils";
import InstrumentListComponent from "../../components/InstrumentListComponent.vue";

describe("InstrumentListComponent", () => {
  const instruments = [
    {
      shortName: "Instrumento 1",
      lastPrice: 100,
      performanceRelative: 50,
      pctDay: 2,
      pct30D: 10,
      pctCY: 20,
      pct1Y: 15,
    },
    {
      shortName: "Instrumento 2",
      lastPrice: 200,
      performanceRelative: 60,
      pctDay: 1,
      pct30D: 15,
      pctCY: 25,
      pct1Y: 20,
    },
    {
      shortName: "Instrumento 3",
      lastPrice: 150,
      performanceRelative: 55,
      pctDay: -1,
      pct30D: 5,
      pctCY: 10,
      pct1Y: 5,
    },
  ];

  it("debería ordenar los instrumentos por nombre de forma ascendente", async () => {
    const wrapper = mount(InstrumentListComponent, {
      props: { instruments },
    });

    const nameColumnButton = wrapper.find("th button");
    await nameColumnButton.trigger("click");

    const rows = wrapper.findAll("tbody tr");
    expect(rows[0].text()).toContain("Instrumento 1");
    expect(rows[1].text()).toContain("Instrumento 2");
    expect(rows[2].text()).toContain("Instrumento 3");
  });
});
