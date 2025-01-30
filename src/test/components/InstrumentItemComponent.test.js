import { shallowMount } from "@vue/test-utils";
import InstrumentItemComponent from "../../components/InstrumentItemComponent.vue";

const instrumentsMock = [
  {
    shortName: "ABC",
    lastPrice: 100,
    performanceRelative: 200,
    pctDay: 1.5,
    pct30D: -2.3,
    pctCY: 5.0,
    pct1Y: -1.2,
  },
  {
    shortName: "XYZ",
    lastPrice: 120,
    performanceRelative: 150,
    pctDay: -0.8,
    pct30D: 3.4,
    pctCY: -4.2,
    pct1Y: 2.1,
  },
  {
    shortName: "DEF",
    lastPrice: 90,
    performanceRelative: 180,
    pctDay: 0.0,
    pct30D: 1.1,
    pctCY: -3.5,
    pct1Y: 4.3,
  },
];

describe("InstrumentItemComponent", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(InstrumentItemComponent, {
      propsData: { instruments: instrumentsMock },
    });
  });

  it("formatea correctamente los porcentajes positivos y negativos", () => {
    expect(wrapper.vm.formatPercentage(2.5)).toBe("+2.50%");
    expect(wrapper.vm.formatPercentage(-1.5)).toBe("-1.50%");
    expect(wrapper.vm.formatPercentage(0)).toBe("+0.00%");
  });

  it("aplica la clase CSS correcta según el valor del porcentaje", () => {
    expect(wrapper.vm.getPercentageClass(1.5)).toBe("positive");
    expect(wrapper.vm.getPercentageClass(-0.5)).toBe("negative");
  });
});
